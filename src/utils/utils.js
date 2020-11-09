
export Utils = {
    VerifyEmail: (email) => {
        let pattern = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
        return (pattern.test(email))
    }
}

