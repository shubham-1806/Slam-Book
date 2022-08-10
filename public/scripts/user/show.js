const token = window.localStorage.getItem('token');

const hidd_but = document.getElementById('hid');

const to_find = hidd_but.innerText; 

axios.post(`/user/${to_find}`,null,{
    headers : {
        authorization : token 
    }
}).then((response)=>{
    if(response.status == 200){
        window.localStorage.setItem('token',response.headers.authorization);
        const id = response.data.user.Id;
        const name = response.data.user.name;
        const type = response.data.user.type;
        const comments = response.data.comment_arr;
        // console.log(response);
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
        for(let i=0;i<comments.length;i++){
            let el = document.createElement('div');
            el.classList.add('comments');
            let ell = document.createElement('p');
            ell.innerText = comments[i];
            ell.classList.add('bod');
            el.appendChild(ell);
            comments_panel.appendChild(el);
        }
        const finder_id = response.data.finder_id;
        if(finder_id != id){
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
    console.log(err);
    // window.location.href = '/?text=unauthorised'
})



