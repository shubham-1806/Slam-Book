const butt = document.getElementById('trigger');
const form = document.getElementById('form');

function handleForm(event){
    event.preventDefault();
}

form.addEventListener('submit',handleForm);     //avoid refreshing of page on form submission to avoid loss of axios response

function butt_click(){

    //if form fields aren't empty

    if(form.elements[0].value && form.elements[1].value && form.elements[2].value ){
        axios.post('/reg',{                             //send post request to register person
            name : form.elements[0].value,
            id : form.elements[1].value,
            type : form.elements[2].value   
        }).then((response)=>{
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

    //alert user to fill all values

    else{
        alert('please fill all values')
    }
}

butt.onclick =butt_click;







