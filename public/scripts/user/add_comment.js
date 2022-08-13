
const form = document.querySelector('.for');

const sbtbtn = document.querySelector('.sbtbtn');

const token = localStorage.getItem('token');

function handleForm(event){         //prevent natural refreshing of page on submitting it which makes the responses of requests disappear
    event.preventDefault();
}

form.addEventListener('submit',handleForm);

sbtbtn.addEventListener('click',()=>{                       //make custom axios post request on clicking submit button
    
    if(form.elements[0].value){                             //if comment body is not empty
        let curr_url = window.location.href;
        curr_url = curr_url.split('?');
        curr_url = curr_url[0];
        curr_url = curr_url.split('/');
        let adder = curr_url[curr_url.length-2];                //get ids of adder and to add from params in url
        let to_add = curr_url[curr_url.length-3];
        axios.post(`/user/${to_add}/${adder}/add_comment`,{         //send a post request to add comment in db
            body : form.elements[0].value,
            to_add : to_add,
            adder : adder   
        },{
            headers : {
                authorization : token                           // add header authorisation token by taking it from localstorage
            }
        }).then((response)=>{

            //if response is ok

            if(response.status == 200){                          
                window.localStorage.setItem('token',response.headers.authorization);        //update the token in localstorage
                alert('added comment');
                window.location.href = `/user/${to_add}`;                           
            }
            else{
                window.location.href = `/?text=commenterror`
            }

        
        //if an error is encountered
            
        }).catch((err)=>{
            console.log(err);
            window.location.href = `/?text=tokenissue`
        })
    }


    else{                                               //alert the user to not keep empty body of comment
        alert('please fill all values')
    }

});


