 const socket=io("//localhost:7003");
    const form =document.getElementById('send-container');
    const messageInput=document.getElementById('messageInp');
    const messageContainer=document.querSelector(".conatainer");
    const  name1=prompt("enter your name");
    socket.emit('new-user-joined',name1)
