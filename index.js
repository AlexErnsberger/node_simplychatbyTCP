var net=require("net");
var count=0;
var users={};

var server=net.createServer(function(conn){
    conn.write('\n > welcome to \033[92mnode-chat\033[39m!'+
               '\n > '+count+' other people are connected at this time.'+
               '\n > please write your name and press enter:');
    count++;

    conn.setEncoding('utf-8');

    var nickname;
    conn.on('data',function(data){
        data=data.replace('\r\n','');

        if(!nickname){
            if(users[data]){
                conn.write('nickname already in use.try again')
            }else{
                nickname=data;
                users[nickname]=conn;
                // for (const i in users) {
                //     users[i].write(nickname+' joined the room');
                // }
                broadcast(nickname+' joined the room');
            }
        }else{
            // for(var i in users){
            //     if(i!==nickname){
            //         users[i].write(nickname+' : '+data);
            //     }
            // }
            broadcast(nickname + ' : '+ data,true);
        }
    })
    conn.on('close',function(){
        count--;
        delete users[nickname];
        broadcast(nickname+' leave the room');
    })

    function broadcast(msg,exceptMyself){
        for(var i in users){
            if(!exceptMyself||i!=nickname){
                users[i].write(msg);
            }
        }
    }
});

server.listen(3000,function(){
    console.log('\033[96m    server listening on *：3000\033[39m');
})