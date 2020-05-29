function alert(){

 
    fetch('/')
    .then(res =>{ return res.json()})        
    .then(data => {console.log(data.message)})


}