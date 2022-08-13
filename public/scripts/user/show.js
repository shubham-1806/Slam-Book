const token = window.localStorage.getItem('token');

const hidd_but = document.getElementById('hid');

const to_find = hidd_but.innerText;             //get text inside the hidden elemnt to understand which user info to get

axios.post(`/user/${to_find}`,null,{            // send post request to that users route with token in headers
    headers : {
        authorization : token 
    }

    //if response is positive

}).then((response)=>{

    //if status is 200

    if(response.status == 200){
        window.localStorage.setItem('token',response.headers.authorization);        //update new token in localstorage
        const id = response.data.user.Id;
        const name = response.data.user.name;
        const type = response.data.user.type;
        const comments = response.data.comment_arr;
        const comment_data = response.data.comment_names;
        const comment_ids = response.data.comment_ids;                      //get all details passed in response
        let el1 = document.createElement('h1');
        el1.innerText=name;
        const left_panel = document.querySelector('.deets');
        left_panel.appendChild(el1);
        let el2 = document.createElement('h1');
        el2.innerText=id;
        left_panel.appendChild(el2);
        let el3 = document.createElement('h1');
        el3.innerText=type;
        left_panel.appendChild(el3);
        const comments_panel = document.querySelector('.comments_panel');
        const for_but = document.querySelector('.left_panel');
        const finder_id = response.data.finder_id;                                      //add left panel of profile page according to html and css


        for(let i=0;i<comments.length;i++){                                             //to add comments iterate through comments arr
            let el = document.createElement('div');
            el.classList.add('comments');
            let ell = document.createElement('p');
            ell.innerText = `${comment_data[i]} : \n\n`+comments[i];
            ell.classList.add('bod');
            el.appendChild(ell);
            const comment_id = (comment_data[i].split(")")[0]).split("(")[1];           //get the name and id of person who added the comment

            if( comment_id == finder_id){                                               // add delte button if current user is the one who added that comment
                let del_but = document.createElement('button');
                del_but.innerText = "Delete";
                del_but.onclick = function (){
                    axios.delete(`/user/${to_find}/${comment_ids[i]}`,{
                        headers : {
                            authorization : token
                        }
                    }).then((res)=>{
                        window.location.reload();                                   //refresh page after deletion to show updation
                    })
                    .catch((error)=>{
                        console.log(error);
                    })
                }
                el.appendChild(del_but);
            }
            comments_panel.appendChild(el);
        }
        if(finder_id != id){                                      //add add comment button if current user is not the person whose profile is being viewed
            let el = document.createElement('button');
            el.innerText = "Add Coment";
            el.onclick = function(){
                window.location.href = `/user/${to_find}/${finder_id}/add_comment`;
            }
            for_but.appendChild(el);
        }
    }
    else{
        window.location.href =  '/?text=error'
    }
}).catch((err)=>{
    window.location.href = '/?text=unauthorised'
})



