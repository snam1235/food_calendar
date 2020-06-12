


function load() {
  
  let i;

  for (i = 0; i < 3; i++) {
    document
      .getElementsByTagName("td")
      [i].setAttribute("contenteditable", "true");
  }

 
}

function addRow(infos) {
  let table = document.getElementById("myTable");
  let len = table.rows.length;
  var row = table.insertRow(len-1);
  let i;
  
    row.insertCell(0).innerHTML = infos.name
    row.insertCell(1).innerHTML = infos.mass
    row.insertCell(2).innerHTML = infos.unit
    row.insertCell(3).innerHTML = infos.carb
    row.insertCell(4).innerHTML = infos.fat
    row.insertCell(5).innerHTML = infos.protein
    row.insertCell(6).innerHTML = infos.calories
    

  



 
}

async function getData(){
 

  let param = {Meal:document.getElementsByName("Meal")[0].value.toString(), Date:document.getElementsByName('day')[0].value.toString()}

 

  const options = {method: 'POST',body: JSON.stringify(param), headers: {
    "Content-Type": "application/json"
  }}

fetch('/history',options)
.then(res =>{ return res.json()})        
.then(data => {
  if(data==null){
    Swal.fire({icon: 'error',
    title: 'Error',
    text: 'Failed for unknown reason'})

} 
  else if(data.message=="fail"){
    Swal.fire({icon: 'error',
    title: 'Error',
    text: 'No entries for the selected date and time, please enter another date and time'})
  }
  else{
    if(document.getElementById("myTable").rows.length>2){
      let i = 1
      
      for(i;i<document.getElementById("myTable").rows.length;i++){
        
        document.getElementById("myTable").deleteRow(1)
      }
    }
    
    let mealCount = data.message.length
    let i =0
    
    for( i;i<mealCount-1;i++){
      
     addRow(data.message[i])
     
    }
   
    let lastRow = document.getElementById("myTable").rows[document.getElementById("myTable").rows.length-1]
    lastRow.cells[3].innerHTML = data.message[mealCount-1].carb
    lastRow.cells[4].innerHTML = data.message[mealCount-1].fat
    lastRow.cells[5].innerHTML = data.message[mealCount-1].protein
    lastRow.cells[6].innerHTML = data.message[mealCount-1].calories
    

 
    
  }





})





}



  

