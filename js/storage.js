var storage = {
    saveRememberMe(isRememberMe){
        localStorage.setItem("IS_REMEMBER_ME", isRememberMe);
    },
    getRememberMe(){
        var isRememberMeStr = localStorage.getItem("IS_REMEMBER_ME");
        if(isRememberMeStr == null){
            return true;
        }
        return JSON.parse(isRememberMeStr.toLowerCase());
    },
    getItem(key){
        return this.getRememberMe() ? localStorage.getItem(key) : sessionStorage.getItem(key);
    },
    setItem(key, value){
        return this.getRememberMe() ? localStorage.setItem(key, value) : sessionStorage.setItem(key, value);
    },
    removeItem(key){
        return this.getRememberMe() ? localStorage.removeItem(key) : sessionStorage.removeItem(key);
    }
}