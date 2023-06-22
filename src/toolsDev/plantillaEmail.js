const plantilla = (pass) => {
  return `      
      <div style="width: 100vw; height: 100vh; background: #ffffff;">
  
          <div style="width: 400px; height: 200px;">
              <h1>tu contraseña nueva</h1>----------------
              <span>cambiala lo mas rapido posible</span>--------------------------------
              <br>
              <br>
              <span style="color: red;">${pass}</span>
          </div>
      </div>    
    `;
};

module.exports = plantilla;
