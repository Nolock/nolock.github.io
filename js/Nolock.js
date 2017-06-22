function heightCalc() {
    $("#map").css({
        height: $(window).height() - ($("#navbar").height() + $("#toolBar").height())
    });
    window.onresize = function(a) {
        $("#map").css({
            height: $(window).height() - ($("#navbar").height() + $("#toolBar").height())
        });
    };
}

function onClickLogin() {
    $("#login").addClass("loading");

    $.get("http://srv10821.kvm-system.de/nolock.php", {
        user: document.getElementById("username").value,
        pw: document.getElementById("password").value
    }).done(function(a) {
        var b = "002";
        if (a.indexOf(b) != (-1)) {
            localStorage.setItem("Benutzer", document.getElementById("username").value);
            localStorage.setItem("Passwort", document.getElementById("password").value);
            localStorage.setItem("Email", "Email@vom.user");
            localStorage.setItem("Benutzerbild", "https://semantic-ui.com/images/avatar/large/justen.jpg");
            localStorage.setItem("googleLogin", "False");
            localStorage.setItem("gsession", "");

            $("#login").removeClass("loading");

            saveLogin();
        } else {
            $("#login").removeClass("loading");
            alert("Bitte überprüfe deine Angaben.");
        }
    });
}

function onClickSignup() {
    $("#signup").addClass("loading");

    var d = document.getElementById("benutzerField").value;
    var c = document.getElementById("passwortField").value;
    var a = document.getElementById("emailField").value;

    var b = validateEmail(a);
    if (d.length > 3 && c.length > 6 && b == true) {
        $.get("http://srv10821.kvm-system.de/nolock.php", {
            register: "",
            nuser: d,
            npw: c,
            nemail: a
        }).done(function(e) {
            if (e.indexOf("333") != -1) {
                $.get("http://srv10821.kvm-system.de/nolock.php", {
                    user: d,
                    pw: c
                }).done(function(a) {
                    var b = "002";
                    if (a.indexOf(b) != (-1)) {
                        localStorage.setItem("Benutzer", d);
                        localStorage.setItem("Email", a);
                        localStorage.setItem("Benutzerbild", "https://semantic-ui.com/images/avatar/large/justen.jpg");
                        localStorage.setItem("loggedIn", "True");
                        localStorage.setItem("googleLogin", "False");
                        localStorage.setItem("gsession", "");

                        $("#signup").removeClass("loading");
                        window.location.replace("main.html");
                    } else {
                        $("#signup").removeClass("loading");
                        alert("Bitte überprüfe deine Angaben.");
                    }
                });

            } else {
                alert("Bitte überprüfe deine Angaben.");
            }
        });
    }
}

function validateEmail(a) {
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(a)) {
        return (true);
    }
    alert("Bitte gib eine richtige Email an!");
    return (false);
}

function onClickLock() {
    $("#lockMyBike").addClass("loading");

    var eingabe = ($("#keyInput").val()).toUpperCase();

    var googleLogin = localStorage.getItem("googleLogin");

    if (googleLogin == "False") {
        $.get("http://srv10821.kvm-system.de/nolock.php", {
            open: eingabe,
            user: "" + localStorage.getItem("Benutzer"),
            pw: "" + localStorage.getItem("Passwort")
        }).done(function(b) {
            getScodes();
            checkLocks();
            $("#lockMyBike").removeClass("loading");
        });
    } else {
        $.get("http://srv10821.kvm-system.de/nolock.php", {
            open: eingabe,
            googlesession: localStorage.getItem("gsession")
        }).done(function(b) {
            getScodes();
            checkLocks();
            $("#lockMyBike").removeClass("loading");
        });
    }
}

function saveLogin() {
    if (typeof(Storage) !== "undefined") {
        localStorage.setItem("loggedIn", "True");
        window.location.replace("main.html");
    } else {
        alert("Sorry, your browser does not support Web Storage...");
    }
}

function checkLogin() {
    if (typeof(Storage) !== "undefined") {
        var a = "" + window.location;
        if (localStorage.getItem("loggedIn") != "True" && a.indexOf("login.html") == -1 && a.indexOf("signup.html") == -1) {
            window.location.replace("login.html");
        } else {
            if (localStorage.getItem("loggedIn") == "True" && a.indexOf("login.html") != -1) {
                window.location.replace("main.html");
            } else {
                if (localStorage.getItem("loggedIn") == "True" && a.indexOf("signup.html") != -1) {
                    window.location.replace("main.html");
                } else {
                    setStorage();
                }
            }
        }
    } else {
        alert("Sorry, your browser does not support Web Storage...");
    }
}

function storageDefault() {
    localStorage.setItem("Benutzer", "");
    localStorage.setItem("Email", "");
    localStorage.setItem("Benutzerbild", "");
    localStorage.setItem("loggedIn", "False");
    localStorage.setItem("googleLogin", "False");
    localStorage.setItem("gsession", "");
    window.location.replace("login.html");
}

function addFastClick() {
    window.addEventListener("load", function() {
        new FastClick(document.body);
    }, false);
}

function setStorage() {
    $(document).ready(function() {
        $("#benutzername").html(localStorage.getItem("Benutzer"));
        $("#email").html(localStorage.getItem("Email"));
        $("#benutzerbild").attr("src", localStorage.getItem("Benutzerbild"));
    });
}

function decideRedirection() {
    if (localStorage.getItem("loggedIn") == "True") {
        window.location.replace("main.html");
    } else {
        window.location.replace("login.html");
    }
}

function getScodes() {

    var googleLogin = localStorage.getItem("googleLogin");

    if (googleLogin == "False") { //wenn der benutzer nicht mit google eingeloggt ist
        $.get("http://srv10821.kvm-system.de/nolock.php", {
            userstatus: "",
            user: localStorage.getItem("Benutzer"),
            pw: localStorage.getItem("Passwort")
        }).done(function(c) {

            if (c.indexOf("SCODE") != -1) {
                var b = c.slice(c.indexOf("SCODE") + 6, c.lastIndexOf("]"));
                localStorage.setItem("scode", b);
                localStorage.setItem("Locks", 1);
                checkLocks();
            } else {
                localStorage.setItem("Locks", 0);
                checkLocks();
            }
        });
    } else {
        $.get("http://srv10821.kvm-system.de/nolock.php", {
            userstatus: "",
            googlesession: localStorage.getItem("gsession")
        }).done(function(c) {

            if (c.indexOf("SCODE") != -1) {
                var b = c.slice(c.indexOf("SCODE") + 6, c.lastIndexOf("]"));
                localStorage.setItem("scode", b);
                localStorage.setItem("Locks", 1);
                checkLocks();
            } else {
                localStorage.setItem("Locks", 0);
                checkLocks();
            }
        });
    }
}

function unlockBike() {
    var googleLogin = localStorage.getItem("googleLogin");

    if (googleLogin == "False") {
        $.get("http://srv10821.kvm-system.de/nolock.php", {
            unlock: localStorage.getItem("scode"),
            user: localStorage.getItem("Benutzer"),
            pw: localStorage.getItem("Passwort")
        }).done(function(b) {

            if (b.indexOf("900") != -1) {
                localStorage.setItem("Locks", 0);
            }
            //  getScodes();

            checkLocks();
        });
    } else {
        $.get("http://srv10821.kvm-system.de/nolock.php", {
            unlock: localStorage.getItem("scode"),
            googlesession: localStorage.getItem("gsession")
        }).done(function(b) {
            if (b.indexOf("900") != -1) {
                localStorage.setItem("Locks", 0);
            }
            //  getScodes();
            checkLocks();
        });
    }
}

function checkLocks() {


    lockQuantity = parseInt(localStorage.getItem("Locks"));

    if (lockQuantity > 0) {
        $("#schlossCard").fadeIn("slow");
        $("#hilfe").fadeOut("slow");
    } else {
        $("#hilfe").fadeIn("slow");
        $("#schlossCard").fadeOut("slow");
    }
}
