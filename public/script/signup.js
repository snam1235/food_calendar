function check_pass() {
    console.log(document.getElementById('pass').value)
    if (document.getElementById('pass').value ==
            document.getElementById('passcheck').value) {
                console.log("pass")
        document.getElementById('submit').disabled = false;
    } else {
        console.log("bot pass")
        document.getElementById('submit').disabled = true;
    }
}

