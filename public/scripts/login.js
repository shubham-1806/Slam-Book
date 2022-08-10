const token = document.getElementById('token').innerText;
const id = document.getElementById('id').innerText;
window.localStorage.setItem('token',token);

window.location.href = `/user/${id}`

// axios.post('/login',null,{
//     headers : {
//         authorization : "Bearer "+token 
//     }
// }).then((response)=>{
//     if(response.status == 200){
//         console.log(response);
//     }
//     else{
//         window.location.href =  '/?text=tokenissue'
//     }
// }).catch((err)=>{
//     console.log(err);
//     window.location.href = '/?text=tokenissue'
// })

