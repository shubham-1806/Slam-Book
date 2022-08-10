const butt = document.getElementById('trigger');
const form = document.getElementById('form');

function handleForm(event){
    event.preventDefault();
}

form.addEventListener('submit',handleForm);

function butt_click(){
    if(form.elements[0].value && form.elements[1].value && form.elements[2].value ){
        axios.post('/reg',{
            name : form.elements[0].value,
            id : form.elements[1].value,
            type : form.elements[2].value   
        }).then((response)=>{
            console.log(response.data);
            let msg = response.data.text;
            if(msg == "again"){
                alert('User has already been registered');
            }
            else if(msg == "und"){
                alert('undefined inputs');
            }
            else if(msg == "registered"){
                alert('registered successfully');
            }
            window.location.href = '/';
        }).catch((err)=>{
            console.log(err);
        })
    }
    else{
        alert('please fill all values')
    }
}

butt.onclick =butt_click;







