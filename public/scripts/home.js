//add links for button clicks on homepage

let reg = document.querySelector('.reg');
let log = document.querySelector('.log');

reg.onclick = function(){
    window.open('https://auth.delta.nitt.edu/authorize?client_id=K9Y5Godr48Aav9kn&redirect_uri=https://glacial-river-34992.herokuapp.com/auth/callback&response_type=code&grant_type=authorization_code&state=register&scope=email+openid+profile+user&nonce=bscsbascbadcsbasccabs','_blank','location=yes','height=200','width=300','scrollbars=yes','status=yes');
}

log.onclick = function(){
    window.open('https://auth.delta.nitt.edu/authorize?client_id=K9Y5Godr48Aav9kn&redirect_uri=https://glacial-river-34992.herokuapp.com/auth/callback&response_type=code&grant_type=authorization_code&state=login&scope=email+openid+profile+user&nonce=bscsbascbadcsbasccabs','_blank','location=yes','height=200','width=300','scrollbars=yes','status=yes');
}


