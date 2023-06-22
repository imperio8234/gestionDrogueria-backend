const plantilla = (nombre) => {
  return `      
      <div style="width: 100vw; height: 100vh; background: #ffffff;">
  
          <div style="width: 400px; height: 200px;">
              <h1>tu sistema villa</h1>----------------
              <span>colombia</span>--------------------------------
              <br>
              <br>
              <span style="color: red;">${nombre} vienvenida a sistema villa</span>
          </div>
      </div>    
    `;
};

module.exports = plantilla;
