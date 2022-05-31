class UI {
  constructor() {
    this.presupuestoError = document.querySelector(".presupuesto-feedback");
    this.gastoError = document.querySelector(".gasto-feedback");
    this.presupuestoForm = document.getElementById("presupuesto-form");
    this.presupuestoInput = document.getElementById("presupuesto-input");
    this.presupuestoMonto = document.getElementById("presupuesto-amount");
    this.gastoMonto = document.getElementById("gasto-amount");
    this.balance = document.getElementById("balance");
    this.balanceMonto = document.getElementById("balance-amount");
    this.gastoForm = document.getElementById("gasto-form");
    this.gastoInput = document.getElementById("gasto-input");
    this.montoInput = document.getElementById("amount-input");
    this.gastoList = document.getElementById("gasto-list");
    this.itemList = [];
    this.itemID = 0;
  }

  
  
  // enviar presupuesto en caso de que no sea un numero negativo o este vacio el ingreso.
  enviarPresupuesto(){
      
      const value = this.presupuestoInput.value;
      var valorStorage = localStorage.setItem("presupuesto", value);
      if(value === '' || value <= 0){
        this.presupuestoError.classList.add('showItem');
        this.presupuestoError.innerHTML = `<p>El valor no puede estar vacio o negativo!</p>`;
        const self = this;
        setTimeout(function(){
          self.presupuestoError.classList.remove('showItem');
        }, 3000);
      } else {
        this.presupuestoMonto.textContent = localStorage.getItem("presupuesto");
        // this.presupuestoMonto.textContent = value;
        this.presupuestoInput.value = '';
        this.mostrarBalance();

        Command: toastr["success"]("Presupuesto agregado", "Notificación")

        toastr.options = {
          "closeButton": false,
          "debug": false,
          "newestOnTop": false,
          "progressBar": false,
          "positionClass": "toast-bottom-right",
          "preventDuplicates": false,
          "onclick": null,
          "showDuration": "300",
          "hideDuration": "1000",
          "timeOut": "5000",
          "extendedTimeOut": "1000",
          "showEasing": "swing",
          "hideEasing": "linear",
          "showMethod": "fadeIn",
          "hideMethod": "fadeOut"
        }
      }

      
  }

  // Mostrar el balance total hasta el momento.
  mostrarBalance(){
    const gasto = this.totalGasto();
    const total = parseInt(this.presupuestoMonto.textContent) - gasto;
    this.balanceMonto.textContent = total;
    if(total < 0){
      this.balance.classList.remove('showGreen', 'showBlack');
      this.balance.classList.add('showRed');
    } else if(total > 0){
      this.balance.classList.remove('showRed', 'showBlack');
      this.balance.classList.add('showGreen');
    } else if(total === 0){
      this.balance.classList.remove('showRed', 'showGreen');
      this.balance.classList.add('showBlack');
    }
    
  }
  
  // Enviar el Gasto desde el Formulario Gasto en caso de que no de error por numero negativo o este vacio.
  enviarGastoForm(){
    const gastoValue = this.gastoInput.value;
    const amountValue = this.montoInput.value;
    if(gastoValue === '' || amountValue === '' || amountValue <= 0){
      this.gastoError.classList.add('showItem');
      this.gastoError.innerHTML = `<p>El valor no puede estar vacio o negativo!</p>`;
      const self = this;
      setTimeout(function(){
        self.gastoError.classList.remove('showItem');
      }, 3000)
    } else {


      
      let amount = parseInt(amountValue);
      this.gastoInput.value = '';
      this.montoInput.value = '';



      let gasto = {
        id: this.itemID,
        title: gastoValue,
        amount: amount
      };

      this.itemID++;
      this.itemList.push(gasto);
      this.addGasto(gasto);
      this.mostrarBalance();

      Command: toastr["error"]("Gasto agregado", "Notificación")

    toastr.options = {
      "closeButton": false,
      "debug": false,
      "newestOnTop": false,
      "progressBar": false,
      "positionClass": "toast-bottom-right",
      "preventDuplicates": false,
      "onclick": null,
      "showDuration": "300",
      "hideDuration": "1000",
      "timeOut": "5000",
      "extendedTimeOut": "1000",
      "showEasing": "swing",
      "hideEasing": "linear",
      "showMethod": "fadeIn",
      "hideMethod": "fadeOut"
    }
      

      
    }
  }

  backup(storedItemList, presupuesto){
    if(storedItemList != null){
      for(const aux of storedItemList){
        this.itemID++;
        this.itemList.push(aux);
        this.addGasto(aux);
      }

      this.totalGasto();

    }

    this.presupuestoMonto.textContent = presupuesto == null? 0 : presupuesto;

    this.totalGasto();

    this.mostrarBalance();
  }


  // Agregar Gasto a la lista.
  addGasto(gasto){

    //ALMACENO EN LOCALSTORAGE LOS GASTOS QUE SE VAN AGREGANDO A LA LISTA Y LOS CONVIERTO
    localStorage.setItem("gastos", JSON.stringify(this.itemList));
    
    this.itemList = JSON.parse(localStorage.getItem("gastos"));

    const div = document.createElement('div');
    div.classList.add('gasto');
    div.innerHTML = `<div class="gasto-item d-flex justify-content-between align-items-baseline">

    <h6 class="gasto-title mb-0 text-uppercase list-item">- ${gasto.title}</h6>
    <h5 class="gasto-amount mb-0 list-item">$${gasto.amount}</h5>

    <div class="gasto-icons list-item">

      <a href="#" class="edit-icon mx-2" data-id="${gasto.id}">
      <i class="fas fa-edit"></i>
      </a>
      <a href="#" class="delete-icon" data-id="${gasto.id}">
      <i class="fas fa-trash"></i>
      </a>
    </div>
    </div`;
    this.gastoList.appendChild(div);
  }

  // Calcular el Total del gasto
  totalGasto(){
    let total = 0;
    
    if(this.itemList.length > 0){
      total = this.itemList.reduce(function(acc, curr){
        acc += curr.amount;
        return acc;
      }, 0)
    } 
    this.gastoMonto.textContent = total.toString();
    return total;
  }

  //Editar el gasto
  editarGasto(element){
    let id = parseInt(element.dataset.id);
    let parent = element.parentElement.parentElement.parentElement;
    //Eliminar del DOM
    this.gastoList.removeChild(parent);
    //Eliminar de la lista
    let gasto = this.itemList.filter(function(item){
      return item.id === id;
    })
    // Mostrar valores
    this.gastoInput.value = gasto[0].title;
    this.montoInput.value = gasto[0].amount;
    //Eliminar de la lista
    let tempList = this.itemList.filter(function(item){
      return item.id !== id;
    })
    this.itemList = tempList;
    this.mostrarBalance();
  }

  // Eliminar Gasto
  eliminarGasto(element){
    let id = parseInt(element.dataset.id);
    let parent = element.parentElement.parentElement.parentElement;
    // Eliminar del DOM
    this.gastoList.removeChild(parent);
    //Eliminar de la lista
    let tempList = this.itemList.filter(function(item){
      return item.id !== id;
    })
    this.itemList = tempList;
    this.mostrarBalance();

    const storage = JSON.parse(localStorage.getItem("gastos"));

    const nuevaLista = [];

    storage.forEach((e) => {
        if(e.id != id)
          nuevaLista.push(e);
    })

    localStorage.removeItem("gastos");
    localStorage.setItem("gastos", JSON.stringify(nuevaLista));

    Command: toastr["error"]("Borrado", "Notificación")

    toastr.options = {
      "closeButton": false,
      "debug": false,
      "newestOnTop": false,
      "progressBar": false,
      "positionClass": "toast-bottom-right",
      "preventDuplicates": false,
      "onclick": null,
      "showDuration": "300",
      "hideDuration": "1000",
      "timeOut": "5000",
      "extendedTimeOut": "1000",
      "showEasing": "swing",
      "hideEasing": "linear",
      "showMethod": "fadeIn",
      "hideMethod": "fadeOut"
    }
  }
}

function eventListeners(){
  const presupuestoForm = document.getElementById('presupuesto-form');
  const gastoForm = document.getElementById('gasto-form');
  const gastoList = document.getElementById('gasto-list');

  //Nueva instancia de UI Class (Constructor en line #1)
  const ui = new UI();
  
  // Presupuesto Form submit
  presupuestoForm.addEventListener('submit', function(event){
    event.preventDefault();
    ui.enviarPresupuesto();
  })
  // Gasto form submit
  gastoForm.addEventListener('submit', function(event){
    event.preventDefault();
    ui.enviarGastoForm();

  })
  //Gasto list submit
  gastoList.addEventListener('click', function(event){
    if (event.target.parentElement.classList.contains('edit-icon')){
      ui.editarGasto(event.target.parentElement);
    }else if (event.target.parentElement.classList.contains('delete-icon')){
      ui.eliminarGasto(event.target.parentElement);
    }
  })
}

document.addEventListener('DOMContentLoaded', function(){
  eventListeners();
})

// Limpiar Storage, mediante Sweet Alert

const btnBorrar = document.getElementById("borrarStorage");

btnBorrar.addEventListener('click', () => {
  
  Swal.fire({
    title: "Está seguro de eliminar el producto?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Sí, seguro",
    cancelButtonText: "No, no quiero",
  }).then((result) => {
    if (result.isConfirmed) {

      localStorage.clear();
      Swal.fire({
        title: "Borrado!",
        icon: "success",
        text: "El archivo ha sido borrado",
        timer: 5000,
      });
    }
    location.reload();
  });
})

// FETCH

var contenido = document.querySelector('#contenido')

        function traer() {
            fetch('./../data/historial.json')
                .then(res => res.json())
                .then(datos => {
                    // console.log(datos)
                    tabla(datos)
                })
        }

        function tabla(datos) {
            contenido.innerHTML = ''
            for(let valor of datos){
                contenido.innerHTML += `
                
                <tr>
                    <th scope="row">${ valor.id }</th>
                    <td>${ valor.nombre }</td>
                    <td>${ valor.monto }</td>
                    <td>${ valor.estado ? "Abonado" : "No abonado" }</td>
                </tr>
                
                `
            }
        }

// Verificar Storage

const storedItemList = localStorage.getItem("gastos");
const presupuesto = localStorage.getItem("presupuesto");

new UI().backup(JSON.parse(storedItemList), presupuesto);
