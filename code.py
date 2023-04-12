function DeobPiterP(){var code=$("#scriptinput").val();socket.emit("DeobPiterP",code);}
socket.on("DeobPiterP",function(code){$("#scriptoutput").val(code);});