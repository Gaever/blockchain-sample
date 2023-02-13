import io from "socket.io-client";

const instance = io(process.env.REACT_APP_WS_URL!);

export default instance;
