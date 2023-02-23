var socket = io("https://localhost:4000/logs");

socket.on("update-logs",function(data){
    console.log(data);
    for(elem in data)
    document.getElementsByClassName("print-logs").innerHTML += '<p>' + elem + '</p>';
})

socket.on("init",function(data){
    console.log(data);
    for(elem in data)
    document.getElementsByClassName("print-logs").innerHTML += '<p>' + elem + '</p>';
})
