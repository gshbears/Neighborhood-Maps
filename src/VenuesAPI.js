
const CLIENT_ID = "1RQPY4GDI3RBUAP3I5LXFBN50UDP52CTJQBHJVGJXAG5IIQL"
const CLIENT_SECRET = "B02UBCMWTDNDPZILRFQVN0RSAS0ZVELLLHXA4BH12RFTPNP5"
const api = "https://api.foursquare.com/v2/venues/explore?"
const location = "29.7030,-98.1245"
const queryLimit  = 10
const categoryid = '4d4b7104d754a06370d81259'

//const url = `${api}/v2/venues/explore?client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&v=20180323&limit=${queryLimit}&ll=${location}&categoryId=${categoryid}`

export const getAllVenues = () =>
  fetch(`${api}client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&v=20180323&limit=${queryLimit}&ll=${location}&categoryId=${categoryid}`)
    .then(res => res.json())
    .then(data => data.response.groups[0].items)
    .catch(error => alert(`Error trying to fetch data : ${api}client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&v=20180323&limit=${queryLimit}&ll=${location}&categoryId=${categoryid}`))
