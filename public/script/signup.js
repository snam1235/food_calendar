function check_pass() {
    console.log(document.getElementById('pass').value)
    if (document.getElementById('pass').value ==
            document.getElementById('passcheck').value) {
        document.getElementBy('submit').disabled = false;
    } else {
        document.getElementById('submit').disabled = true;
    }
}