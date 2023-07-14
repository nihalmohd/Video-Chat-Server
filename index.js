const express = require("express");
const app = express();
const server = require("http").createServer(app);
const cors = require("cors");
const io = require("socket.io")(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

app.use(cors());

const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.send("Server is running on port 5000");
});

io.on('connection',(socket)=>{
  socket.emit("me",socket.id);

  socket.on("disconnect",()=>{
    socket.broadcast.emit("callEnded")
  })
  socket.on("calluser",({useToCall,signalData,from,name})=>{
    io.to(useToCall).emit("calluser",{sigmal:signalData,from,name})
  })
  socket.on("answercall",(data)=>{
    io.to(data.to).emit("callAccepted",data.sigmal)
  })
})

server.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
