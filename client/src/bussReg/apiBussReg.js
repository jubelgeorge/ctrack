export const create = (userId, token, bussReg) => {   
    return fetch(`${process.env.REACT_APP_API_URL}/bussreg/new/${userId}`, {
        method: "POST",
        headers: {
            Accept: "application/json",
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(bussReg)
    })
        .then(response => {
            return response.json();
        })
        .catch(err => console.log(err));
};

export const list = () => {
    return fetch(`${process.env.REACT_APP_API_URL}/bussregs`, {
        method: 'GET'        
    })
    .then(response => {
        return response.json();
    })
    .catch(err => console.log(err));
};