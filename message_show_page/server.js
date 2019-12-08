var express = require('express');
var app = express();
const multer = require('multer');
const mysql = require('mysql2');
var fs = require('fs');

const upload = multer({dest: __dirname + '/static_file/uploads/images'});
app.use(express.static('static_file'));
app.use(express.json())

// POST image
app.post('/upload/:uid', upload.single('photo'), (req, res) => {
    if(req.file) {
        //res.json(req.file);
        console.log('Get user image [' + new Date().toLocaleString() + ']');
        console.log(req.file);
        fs.rename(req.file.destination + '/' + req.file.filename, req.file.destination + '/' + req.file.originalname, function(err) {
            if ( err ) console.log('ERROR: ' + err);
            var path = '/uploads/images/' + req.file.originalname;

            const connection = mysql.createConnection({
                host: 'localhost',
                user: 'root',
                password: 'Zz100xy;',
                database: 'hood_chat'
            });

            connection.execute(
                'update `user` ' +
                    'set ' +
                    'uphoto = ? ' +
                    'where uid = ?',
                [path, req.params.uid],
                function(err, results, fields) {
                    if (err) {
                        throw err;
                    }
                    console.log('Update user profile photo [' + new Date().toLocaleString() + ']');
                    // console.log(results);
                    // res.json(results);
                    connection.destroy();
                    res.redirect('/profile_page.html?uid=' + req.params.uid);
                }
            )
        });
    }
    else throw 'error';
});

// GET available block
app.get('/available_block/:uid', function(req, res) {
    const connection = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'Zz100xy;',
        database: 'hood_chat'
    });

    connection.execute(
        'select * ' + 
        'from block ',
        [],
        function(err, results, fields) {
            if (err) {
                throw err;
            }
            console.log('Get available block [' + new Date().toLocaleString() + ']');
            console.log(results);
            res.json(results);
            connection.destroy();
        }
    )
})

// Comfirm application
app.get('/comfirm_application/:bid/:new_uid', function(req, res) {
    const connection = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'Zz100xy;',
        database: 'hood_chat'
    });

    connection.execute(
        'select acount from applies where bid = ? and uid = ?',
        [req.params.bid, req.params.new_uid],
        function(err, results, fields) {
            if (err) {
                throw err;
            }
            console.log('Get count for application [' + new Date().toLocaleString() + ']');
            console.log(results);

            var count = results[0].acount;
            connection.execute(
                'update applies ' + 
                'set ' +
                'acount =  ? ' +
                'where bid = ? and uid = ?',
                [count + 1, req.params.bid, req.params.new_uid],
                function(err, results, fields) {
                    if (err) {
                        throw err;
                    }
                    console.log('Update applies table [' + new Date().toLocaleString() + ']');
                    res.json(results);

                    connection.execute(
                        'select count(uid) as cnt from ins where bid = ?',
                        [req.params.bid],
                        function(err, results, fields) {
                            if (err) {
                                throw err;
                            }
                            console.log('Get block member num from ins table [' + new Date().toLocaleString() + ']');
                            if (count + 1 >= 3 || count + 1 == results[0].cnt) {
                                connection.execute(
                                    'delete from applies where uid = ?',
                                    [req.params.new_uid],
                                    function(err, results, fields) {
                                        if (err) {
                                            throw err;
                                        }
                                        console.log('Delete tuple from applies table [' + new Date().toLocaleString() + ']');
                                    }
                                )
        
                                connection.execute(
                                    'insert into ins(uid, bid) values (?, ?)',
                                    [req.params.new_uid, req.params.bid],
                                    function(err, results, fields) {
                                        if (err) {
                                            throw err;
                                        }
                                        console.log('Insert into ins table [' + new Date().toLocaleString() + ']');
                                        connection.destroy();
                                    }
                                )
                            }
                        }
                    )
                }
            )
        }
    )
})

// GET new member application
app.get('/new_member_application/:uid', function(req, res) {
    const connection = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'Zz100xy;',
        database: 'hood_chat'
    });

    connection.execute(
        'select bid ' + 
        'from ins where uid = ? ',
        [req.params.uid],
        function(err, results, fields) {
            if (err) {
                throw err;
            }
            console.log('Get user block [' + new Date().toLocaleString() + ']');
            console.log(results);

            if (results[0]) {
                var bid = results[0].bid;
                connection.execute(
                    'select * from applies natural join user where bid = ?',
                    [bid],
                    function(err, results, fields) {
                        if (err) {
                            throw err;
                        }
                        console.log('Get new application [' + new Date().toLocaleString() + ']');
                        console.log(results);
                        res.json(results);
                        connection.destroy();
                    }
                )
            } else {
                res.json(results);
                connection.destroy();
            }
            
        }
    )
})

// Log out
app.get('/logout/:uid', function(req, res) {
    const connection = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'Zz100xy;',
        database: 'hood_chat'
    });

    var date = new Date();
    var form_date = '' + date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + ' ' +
    date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
    console.log(form_date);
    connection.execute(
        'update lastvisit set ltimestamp = ? where uid = ?',
        [form_date, req.params.uid],
        function(err, results, fields) {
            if (err) {
                throw err;
            }
            console.log('Insert into lastvisit table [' + new Date().toLocaleString() + ']');
            // console.log(results);
            res.json(results);
            connection.destroy();
        }
    )
})

// create block application
app.get('/apply_block/:uid/:bid', function(req, res) {
    const connection = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'Zz100xy;',
        database: 'hood_chat'
    });

    connection.execute(
        'delete from `ins` where uid = ?',
        [req.params.uid],
        function(err, results, fields) {
            if (err) {
                throw err;
            }
            console.log('Delete from ins table [' + new Date().toLocaleString() + ']');
            // console.log(results);
            // res.json(results);
        }
    )

    connection.execute(
        'insert into applies(uid, bid, acount) values (?, ?, 0)',
        [req.params.uid, req.params.bid],
        function(err, results, fields) {
            if (err) {
                throw err;
            }
            console.log('Insert into applies table [' + new Date().toLocaleString() + ']');
            // console.log(results);
            res.json(results);
            connection.destroy();
        }
    )
})

// GET block info
app.get('/user_block/:uid', function(req, res) {
    const connection = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'Zz100xy;',
        database: 'hood_chat'
    });

    connection.execute(
        'select * ' + 
        'from block natural join ins ' + 
        'where uid = ?',
        [req.params.uid],
        function(err, results, fields) {
            if (err) {
                throw err;
            }
            console.log('Get user block info [' + new Date().toLocaleString() + ']');
            console.log(results);
            res.json(results);
            connection.destroy();
        }
    )
})

// GET user frofile
app.get('/user_profile/:uid', function(req, res) {
    const connection = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'Zz100xy;',
        database: 'hood_chat'
    });

    connection.execute(
        'select * ' + 
        'from user ' + 
        'where uid = ?',
        [req.params.uid],
        function(err, results, fields) {
            if (err) {
                throw err;
            }
            console.log('Get user profile [' + new Date().toLocaleString() + ']');
            console.log(results);
            res.json(results);
            connection.destroy();
        }
    )
})

// GET register check info
app.get('/register/:uname/:ufullname/:uaddress/:uemail/:pwd', function(req, res) {
    const connection = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'Zz100xy;',
        database: 'hood_chat'
    });

    connection.execute(
        'select uid ' + 
        'from user ' + 
        'where uname = ? or uemail = ?',
        [req.params.uname, req.params.uemail],
        function(err, results, fields) {
            if (err) {
                throw err;
            }
            console.log('Get results for register check [' + new Date().toLocaleString() + ']');
            console.log(results);

            if (results[0]) {
                res.json('fail');
                connection.destroy();
            } else {
                connection.execute(
                    'insert into user(uname, ufullname, uaddress, uemail, upassword, uphoto) values' +
                    '(?, ?, ?, ?, ?, ?)',
                    [req.params.uname, req.params.ufullname, req.params.uaddress, req.params.uemail, req.params.pwd, 'https://ptetutorials.com/images/user-profile.png'],
                    function(err, results, fields) {
                        if (err) {
                            throw err;
                        }
                        console.log('Insert into user table for registration [' + new Date().toLocaleString() + ']');
                        // console.log(results);
                        res.json('ok');
                        connection.destroy();
                    }
                )
            }
        }
    )
})

// GET login check info
app.get('/login_check/:uname/:pwd', function(req, res) {
    const connection = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'Zz100xy;',
        database: 'hood_chat'
    });

    console.log(req.params.uname);
    console.log(req.params.pwd);

    connection.execute(
        'select uid ' + 
        'from `user` ' + 
        'where `uname` = ? and `upassword` = ?',
        [req.params.uname, req.params.pwd],
        function(err, results, fields) {
            if (err) {
                throw err;
            }
            console.log('Get results for login check [' + new Date().toLocaleString() + ']');
            console.log(results);
            res.json(results);
            connection.destroy();
        }
    )
})

// GET accessible thread
app.get('/all_thread/:uid', function (req, res) {
    const connection = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'Zz100xy;',
        database: 'hood_chat'
    });
    
    connection.execute(
        'select `thid`, ttype ' + 
        'from `contains` natural join topic ' + 
        'where `tid` in (select `tid` ' + 
                        'from `topic` natural join `specifies` ' + 
                        'where `specifies`.`uid` = ?)',
        [req.params.uid],
        function(err, results, fields) {
            if (err) {
                throw err;
            }
            console.log('Get results for accessible thread [' + new Date().toLocaleString() + ']');
            console.log(results);
            res.json(results);
            connection.destroy();
        }
    );
})

// GET latest message
app.get('/latest_message/:thid/:uid', function (req, res) {
    const connection = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'Zz100xy;',
        database: 'hood_chat'
    });
    // console.log(req.params.thid);
    // console.log(req.params.uid);
    connection.execute(
        'select max(mtimestamp) as `max_timestamp` ' + 
        'from (select `has`.`mid` as `mid` ' + 
                'from `has` ' + 
                'where `thid` = ? and `has`.`mid` in (select `mid` ' + 
                                                    'from `accesses` ' + 
                                                    'where `accesses`.`uid` = ?)) as `T0` ' +
                'natural join `message`',
        [req.params.thid, req.params.uid],
        function(err, results, fields) {
            if (err) {
                throw err;
            }
            console.log('Get results for thread message max timestamp [' + new Date().toLocaleString() + ']');
            console.log(results);

            var time = results;
            connection.execute(
                'select * ' + 
                'from (`has` natural join `message`) join `user` on `message`.`uid` = `user`.`uid` ' + 
                'where `thid` = ? and `mtimestamp` = ?',
                [req.params.thid, time[0].max_timestamp],
                function(err, results, fields) {
                    if (err) {
                        throw err;
                    }
                    console.log('Get results for thread latest message [' + new Date().toLocaleString() + ']');
                    console.log(results);
                    res.json(results);
                    connection.destroy();
                }
            )
        }
    );
})

// GET complete thread message
app.get('/thread_message/:thid/:uid', function (req, res) {
    const connection = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'Zz100xy;',
        database: 'hood_chat'
    });
    
    connection.execute(
        'select * ' + 
        'from (select `has`.`mid` as `mid` ' + 
                'from `has` ' + 
                'where `thid` = ? and `has`.`mid` in (select `mid` ' + 
                                                    'from `accesses` ' + 
                                                    'where `accesses`.`uid` = ?)) as `T0` ' +
                'natural join `message`',
        [req.params.thid, req.params.uid],
        function(err, results, fields) {
            if (err) {
                throw err;
            }
            console.log('Get results for accessible complete thread message [' + new Date().toLocaleString() + ']');
            console.log(results);
            res.json(results);
            connection.destroy();
        }
    );
})

// GET search message
app.get('/search_msg/:keywords/:uid', function (req, res) {
    const connection = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'Zz100xy;',
        database: 'hood_chat'
    });
    // console.log(req.params.keywords);
    // console.log(req.params.uid);
    
    connection.execute(
        'select * ' + 
        'from (select `has`.`mid` as `mid` ' + 
                'from `has` ' + 
                'where `has`.`mid` in (select `mid` ' + 
                                        'from `accesses` ' + 
                                        'where `accesses`.`uid` = ?)) as `T0` ' +
                'natural join `message` natural join `user`' +
        'where `message`.`mtext` like ?',
        [req.params.uid, '%' + req.params.keywords + '%'],
        function(err, results, fields) {
            if (err) {
                throw err;
            }
            console.log('Get results for search message [' + new Date().toLocaleString() + ']');
            console.log(results);
            res.json(results);
            connection.destroy();
        }
    );
})

// GET all friends
app.get('/all_friend/:uid', function (req, res) {
    const connection = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'Zz100xy;',
        database: 'hood_chat'
    });
    
    connection.execute(
        'select * ' + 
        'from (select f1.fid as uid ' + 
            'from friends as f1, friends as f2 ' + 
            'where f1.uid = f2.fid and f1.fid = f2.uid and f1.uid = ?) as `T1` ' + 
            'natural join `user`',
        [req.params.uid],
        function(err, results, fields) {
            if (err) {
                throw err;
            }
            console.log('Get all friends [' + new Date().toLocaleString() + ']');
            console.log(results);
            res.json(results);
            connection.destroy();
        }
    );
})

// GET all neighbors
app.get('/all_neighbor/:uid', function (req, res) {
    const connection = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'Zz100xy;',
        database: 'hood_chat'
    });
    
    connection.execute(
        'select * ' +
        'from (select `nid` as `uid`' + 
            'from `neighbors` ' + 
            'where `uid` = ?) as `T0` natural join `user`',
        [req.params.uid],
        function(err, results, fields) {
            if (err) {
                throw err;
            }
            console.log('Get all neighbors [' + new Date().toLocaleString() + ']');
            console.log(results);
            res.json(results);
            connection.destroy();
        }
    );
})

// GET all topics
app.get('/all_topic/:uid', function (req, res) {
    const connection = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'Zz100xy;',
        database: 'hood_chat'
    });
    
    connection.execute(
        'select * ' +
        'from `specifies` natural join `topic` ' + 
        'where `uid` = ?',
        [req.params.uid],
        function(err, results, fields) {
            if (err) {
                throw err;
            }
            console.log('Get all topics [' + new Date().toLocaleString() + ']');
            console.log(results);
            res.json(results);
            connection.destroy();
        }
    );
})

// POST reply message
app.post('/reply_msg/:uid/:thid', function(req, res) {
    const connection = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'Zz100xy;',
        database: 'hood_chat'
    });

    var date = new Date();
    var form_date = '' + date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + ' ' +
    date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
    connection.execute(
        'insert into `message`(`uid`, `mtitle`, `mtimestamp`, `mtext`, `mx`, `my`) values ' + 
        '(?, ?, ?, ?, 0, 0);',
        [req.params.uid, 'a reply', form_date, req.body.reply],
        function(err, results, fields) {
            if (err) {
                throw err;
            }
            console.log('Insert 1 reply message into message table [' + new Date().toLocaleString() + ']');

            connection.execute(
                'select `mid` from `message` where `mtimestamp` = ?',
                [form_date],
                function(err, results, fields) {
                    if (err) {
                        throw err;
                    }
                    console.log('Get reply message mid from message table [' + new Date().toLocaleString() + ']');
                    var mid = results[0].mid;

                    connection.execute(
                        'insert into `has`(`thid`, `mid`) values (?, ?)',
                        [req.params.thid, mid],
                        function(err, results, fields) {
                            if (err) {
                                throw err;
                            }
                            console.log('Insert 1 record into has table [' + new Date().toLocaleString() + ']');

                            connection.execute(
                                'insert into accesses(mid, uid) ' +
                                'select T0.mid, T1.uid ' +
                                'from (select accesses.uid as uid ' +
                                    'from (select min(has.mid) as mid ' +
                                        'from has natural join message ' +
                                        'where thid = ?) as T0 natural join accesses) as T1, (select mid ' + 
                                                                                            'from message ' + 
                                                                                            'where mid = ?) as T0',
                                [req.params.thid, mid],
                                function(err, results, fields) {
                                    if (err) {
                                        throw err;
                                    }
                                    console.log('Insert records into accesses table [' + new Date().toLocaleString() + ']');
                                    res.send(form_date);
                                    connection.destroy();
                                }
                            )
                        }
                    )
                }
            )
        }
    );
})

// POST new topic 
app.post('/new_topic/:uid/:ttype', function(req, res) {
    const connection = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'Zz100xy;',
        database: 'hood_chat'
    });

    connection.execute(
        'insert into `topic`(`tsubject`, `ttype`) values (?, ?)',
        [req.body.topic_name, req.params.ttype],
        function(err, results, fields) {
            if (err) {
                throw err;
            }
            console.log('Insert 1 new topic into topic table [' + new Date().toLocaleString() + ']');

            connection.execute(
                'select count(`tid`) as `tid` from `topic`',
                [],
                function(err, results, fields) {
                    if (err) {
                        throw err;
                    }
                    console.log('Get topic id from topic table [' + new Date().toLocaleString() + ']');

                    connection.execute(
                        'insert into `posts`(`uid`, `tid`) values (?, ?)',
                        [req.params.uid, results[0].tid],
                        function(err, results, fields) {
                            if (err) {
                                throw err;
                            }
                            console.log('Insert into posts table [' + new Date().toLocaleString() + ']');
                        }
                    )

                    if (req.params.ttype == 'hood') {
                        connection.execute(
                            'insert into `specifies`(`tid`, `uid`) ' + 
                            'select `T1`.`tid`, `T0`.`uid` ' +
                            'from (select `uid` ' + 
                                'from `ins` natural join `belongs` ' + 
                                'where `hid` in (select `hid` ' + 
                                                'from `ins` natural join `belongs` ' +
                                                'where `uid` = ?)) as `T0`, (select `tid` ' + 
                                                                            'from `topic` ' + 
                                                                            'where `tid` = ?) as `T1`',
                            [req.params.uid, results[0].tid],
                            function(err, results, fields) {
                                if (err) {
                                    throw err;
                                }
                                console.log('Insert into specifies table [' + new Date().toLocaleString() + ']');
                                res.send('ok');
                                connection.destroy();
                            }
                        )
                    } else if (req.params.ttype == 'block') {
                        connection.execute(
                            'insert into `specifies`(`tid`, `uid`) ' + 
                            'select `T1`.`tid`, `T0`.`uid` ' + 
                            'from(select `uid` ' + 
                                'from `ins` ' + 
                                'where `bid` in (select `bid` ' + 
                                                'from `ins` ' + 
                                                'where `uid` = ?)) as `T0`, ' +
                                                '(select `tid` ' + 
                                                'from `topic` ' + 
                                                'where `tid` = ?) as `T1`',
                            [req.params.uid, results[0].tid],
                            function(err, results, fields) {
                                if (err) {
                                    throw err;
                                }
                                console.log('Insert into specifies table [' + new Date().toLocaleString() + ']');
                                res.send('ok');
                                connection.destroy();
                            }
                        )
                    } else if (req.params.ttype == 'friend') {
                        connection.execute(
                            'insert into `specifies`(`tid`, `uid`) values' +
                            '(?, ?)',
                            [results[0].tid, req.params.uid],
                            function(err, results, fields) {
                                if (err) {
                                    throw err;
                                }
                                console.log('Insert into specifies table [' + new Date().toLocaleString() + ']');
                            }
                        )
                        connection.execute(
                            'insert into `specifies`(`tid`, `uid`) ' + 
                            'select `T1`.`tid`, `T0`.`uid` ' + 
                            'from(select `f1`.`fid` as `uid`' + 
                                'from `friends` as `f1`, `friends` as `f2` ' + 
                                'where `f1`.`uid` = `f2`.`fid` and `f1`.`fid` = `f2`.`uid` and `f1`.`uid` = ?) as `T0`, ' + 
                                '(select `tid` ' + 
                                'from `topic` ' + 
                                'where `tid` = ?) as `T1`',
                            [req.params.uid, results[0].tid],
                            function(err, results, fields) {
                                if (err) {
                                    throw err;
                                }
                                console.log('Insert into specifies table [' + new Date().toLocaleString() + ']');
                                res.send('ok');
                                connection.destroy();
                            }
                        )
                    } else {
                        connection.execute(
                            'insert into `specifies`(`tid`, `uid`) values' +
                            '(?, ?)',
                            [results[0].tid, req.params.uid],
                            function(err, results, fields) {
                                if (err) {
                                    throw err;
                                }
                                console.log('Insert into specifies table [' + new Date().toLocaleString() + ']');
                            }
                        )
                        connection.execute(
                            'insert into `specifies`(`tid`, `uid`) ' + 
                            'select `T1`.`tid`, `T0`.`uid` ' + 
                            'from(select `nid` as `uid`' + 
                                'from `neighbors` ' + 
                                'where `uid` = ?) as `T0`, ' + 
                                '(select `tid` ' + 
                                'from `topic` ' + 
                                'where `tid` = ?) as `T1`',
                            [req.params.uid, results[0].tid],
                            function(err, results, fields) {
                                if (err) {
                                    throw err;
                                }
                                console.log('Insert into specifies table [' + new Date().toLocaleString() + ']');
                                res.send('ok');
                                connection.destroy();
                            }
                        )
                    }
                }
            )
        }
    )
})

// POST profile
app.post('/update_profile/:uid', function(req, res) {
    const connection = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'Zz100xy;',
        database: 'hood_chat'
    });

    connection.execute(
        'update `user` ' +
        'set ' +
            'uprofile = ? ' +
        'where uid = ?',
        [req.body.profile, req.params.uid],
        function(err, results, fields) {
            if (err) {
                throw err;
            }
            console.log('Update profile in user table [' + new Date().toLocaleString() + ']');
            res.send('ok');
            connection.destroy();
        }
    )
})

// POST new thread 
app.post('/new_thread/:uid/:tid/:type_num', function(req, res) {
    const connection = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'Zz100xy;',
        database: 'hood_chat'
    });

    connection.execute(
        'select count(`thid`) as `thid` from `thread`',
        [],
        function(err, results, fields) {
            if (err) {
                throw err;
            }
            console.log('Calculate thread id from thread table [' + new Date().toLocaleString() + ']');

            var thid = results[0].thid + 1;
            //console.log(thid);
            
            connection.execute(
                'insert into `thread`(`thid`) values (?)',
                [thid],
                function(err, results, fields) {
                    if (err) {
                        throw err;
                    }
                    console.log('Insert 1 new thread into thread table [' + new Date().toLocaleString() + ']');

                    connection.execute(
                        'insert into `contains`(`tid`, `thid`) values (?, ?)',
                        [req.params.tid, thid],
                        function(err, results, fields) {
                            if (err) {
                                throw err;
                            }
                            console.log('Insert 1 new record into contains table [' + new Date().toLocaleString() + ']');
                        }
                    )
                }
            )

            var date = new Date();
            var form_date = '' + date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + ' ' +
            date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
            connection.execute(
                'insert into `message`(`uid`, `mtitle`, `mtimestamp`, `mtext`, `mx`, `my`) values ' + 
                '(?, ?, ?, ?, 0, 0);',
                [req.params.uid, req.body.mtitle, form_date, 'Hi, I have created a new thread!'],
                function(err, results, fields) {
                    if (err) {
                        throw err;
                    }
                    console.log('Insert 1 first message for new thread into message table [' + new Date().toLocaleString() + ']');

                    connection.execute(
                        'select `mid` from `message` where `mtimestamp` = ?',
                        [form_date],
                        function(err, results, fields) {
                            if (err) {
                                throw err;
                            }
                            console.log('Get first message mid from message table [' + new Date().toLocaleString() + ']');
                            var mid = results[0].mid;

                            connection.execute(
                                'insert into `has`(`thid`, `mid`) values (?, ?)',
                                [thid, mid],
                                function(err, results, fields) {
                                    if (err) {
                                        throw err;
                                    }
                                    console.log('Insert 1 record into has table [' + new Date().toLocaleString() + ']');
                                }
                            )

                            //difficult task
                            if (req.params.type_num != 30000 && req.params.type_num != 40000) {
                                connection.execute(
                                    'insert into accesses(mid, uid) values (?, ?)',
                                    [mid, req.params.uid],
                                    function(err, results, fields) {
                                        if (err) {
                                            throw err;
                                        }
                                        console.log('Insert records into accesses table [' + new Date().toLocaleString() + ']');
                                    
                                        if (req.params.type_num == 10000) {
                                            connection.execute(
                                                'insert into accesses(mid, uid) ' +
                                                'select mid, uid ' + 
                                                'from (select f1.fid as uid ' + 
                                                    'from friends as f1, friends as f2 ' + 
                                                    'where f1.uid = f2.fid and f1.fid = f2.uid and f1.uid = ?) as `T1`, ' + 
                                                    '(select mid ' + 
                                                    'from message ' +
                                                    'where mid = ?) as `T0`',
                                                [req.params.uid, mid],
                                                function(err, results, fields) {
                                                    if (err) {
                                                        throw err;
                                                    }
                                                    console.log('Insert friend accessibiliy into accesses table [' + new Date().toLocaleString() + ']');
                                                    res.send('ok');
                                                    connection.destroy();
                                                }
                                            )
                                        } else if (req.params.type_num == 20000) {
                                            connection.execute(
                                                'insert into accesses(mid, uid) ' +
                                                'select mid, uid ' + 
                                                'from (select `nid` as `uid` ' + 
                                                    'from `neighbors` ' + 
                                                    'where `uid` = ?) as `T1`, ' + 
                                                    '(select mid ' + 
                                                    'from message ' +
                                                    'where mid = ?) as `T0`',
                                               [req.params.uid, mid],
                                                function(err, results, fields) {
                                                    if (err) {
                                                        throw err;
                                                    }
                                                    console.log('Insert neighbor accessibiliy into accesses table [' + new Date().toLocaleString() + ']');
                                                    res.send('ok');
                                                    connection.destroy();
                                                }
                                            )
                                        } else {
                                            connection.execute(
                                                'insert into accesses(mid, uid) values ' +
                                                '(?, ?)',
                                               [mid, req.params.type_num],
                                                function(err, results, fields) {
                                                    if (err) {
                                                        throw err;
                                                    }
                                                    console.log('Insert a person accessibiliy into accesses table [' + new Date().toLocaleString() + ']');
                                                    res.send('ok');
                                                    connection.destroy();
                                                }
                                            )
                                        }
                                    }
                                )
                            } else {
                                if (req.params.type_num == 30000) {
                                    connection.execute(
                                        'insert into accesses(mid, uid) ' +
                                        'select T1.mid, T0.uid ' + 
                                        'from (select `uid` ' + 
                                            'from `ins` ' + 
                                            'where `bid` in (select `bid` ' + 
                                                            'from `ins` ' + 
                                                            'where `uid` = ?)) as `T0`, ' +
                                            '(select mid ' + 
                                            'from message ' +
                                            'where mid = ?) as `T1`',
                                       [req.params.uid, mid],
                                        function(err, results, fields) {
                                            if (err) {
                                                throw err;
                                            }
                                            console.log('Insert block accessibiliy into accesses table [' + new Date().toLocaleString() + ']');
                                            res.send('ok');
                                            connection.destroy();
                                        }
                                    )
                                } else {
                                    connection.execute(
                                        'insert into accesses(mid, uid) ' +
                                        'select T1.mid, T0.uid ' + 
                                        'from (select `uid` ' + 
                                            'from `ins` natural join `belongs` ' + 
                                            'where `hid` in (select `hid` ' + 
                                                            'from `ins` natural join `belongs` ' +
                                                            'where `uid` = ?)) as `T0`, ' +
                                            '(select mid ' + 
                                            'from message ' +
                                            'where mid = ?) as `T1`',
                                       [req.params.uid, mid],
                                        function(err, results, fields) {
                                            if (err) {
                                                throw err;
                                            }
                                            console.log('Insert hood accessibiliy into accesses table [' + new Date().toLocaleString() + ']');
                                            res.send('ok');
                                            connection.destroy();
                                        }
                                    )
                                }
                            }
                        }
                    )
                }
            );
            
        }
    )
})

app.listen(9229, () => {
    console.log('Server started at http://localhost:9229/ [' + new Date().toLocaleString() + ']');
});