
const form = document.querySelector('.for');
const sbtbtn = document.querySelector('.sbtbtn');

const token = localStorage.getItem('token');

function handleForm(event){
    event.preventDefault();
}

form.addEventListener('submit',handleForm);

sbtbtn.addEventListener('click',()=>{
    if(form.elements[0].value){
        let curr_url = window.location.href;
        curr_url = curr_url.split('?');
        curr_url = curr_url[0];
        curr_url = curr_url.split('/');
        let adder = curr_url[curr_url.length-2];
        let to_add = curr_url[curr_url.length-3];
        axios.post(`/user/${to_add}/${adder}/add_comment`,{
            body : form.elements[0].value,
            to_add : to_add,
            adder : adder   
        },{
            headers : {
                authorization : token 
            }
        }).then((response)=>{
            if(response.status == 200){
                window.localStorage.setItem('token',response.headers.authorization);
                alert('added comment');
                window.location.href = `/user/${to_add}`;
            }
            else{
                window.location.href = `/?text=commenterror`
            }
        }).catch((err)=>{
            console.log(err);
            window.location.href = `/?text=tokenissue`
        })
    }
    else{
        alert('please fill all values')
    }
});


