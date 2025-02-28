const Home = () => {
  return (
    <div className="row">
      <div className="main">
        <div className="input-container">
          <input
            type="text"
            className="chat-input"
            placeholder="List your ingredients here ..."
          />
          <button className="send-button">Send</button>
        </div>
      </div>
    </div>
  );
};

export default Home;
