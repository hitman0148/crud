import axios from 'axios'

export default {
	data (){
		return {
			// apiUrl : 'http://localhost/project/crud-api/public/',
			// apiUrl : 'http://115.84.243.173/crud/crud-api/public/',
			apiUrl : 'https://hitman.sgccserver02.com/crud-api/public/',
			// token: this.$q.localStorage.getItem('token'),
			// userid: 19,
			// userRoles : [],
			userData : {
				// id: this.$q.localStorage.getItem('id'),
				// fullname: this.$q.localStorage.getItem('fullname'),
				// employee_id: this.$q.localStorage.getItem('employee_id'),
				// privilege: this.$q.localStorage.getItem('privilege'),
				profile: this.$q.localStorage.getItem('profile'),
				email: this.$q.cookies.get('email'),
				id: this.$q.cookies.get('id'),
				fullname: this.$q.cookies.get('fullname'),
				employee_id: this.$q.cookies.get('employee_id'),
				privilege: this.$q.cookies.get('privilege'),
				is_auth: this.$q.cookies.get('is_auth'),
				is_login: this.$q.cookies.get('is_login'),
				join_date: this.$q.cookies.get('join_date'),
				role: this.$q.cookies.get('role'),

			},
			category_data: [],
			choices_data:[],
			options: {expires: '5h'}
		}
	},
	methods : {

        logActions(data,action,uid){
            let formData = {json_data: JSON.parse(JSON.stringify(data)), user_action: action, user_id: uid}
            axios.post(this.apiUrl+'logs/store',formData,{
                headers: {'Content-Type': 'application/json'}
            }).then((res) => {
                console.log('result mixin:',res)
            })
        },
		msgAlert (msg,color,icon) {
			this.$q.notify({
				message: msg,
				color: color,
				icon: icon
			})
		},

		logoutData(){
			console.log('logoutData')
			this.$q.localStorage.clear()
			this.$q.cookies.remove('id')
			this.$q.cookies.remove('employee_id')
			this.$q.cookies.remove('fullname')
			this.$q.cookies.remove('privilege')
			this.$q.cookies.remove('is_auth')
			this.$q.cookies.remove('is_login')
			this.$q.cookies.remove('role')
			this.$q.cookies.remove('email')
			this.$q.cookies.remove('join_date')
			window.location = '#/'
		},
		loginData(row){
			window.location = "#/hris"
			let role = (row.privilege == 1) ? 'Admin' : 'User'
			this.$q.localStorage.set('profile',row.profile)
			this.$q.cookies.set('id',row.id,this.options)
			this.$q.cookies.set('employee_id',row.employee_id,this.options)
			this.$q.cookies.set('fullname',row.fullname,this.options)
			this.$q.cookies.set('privilege',row.privilege,this.options)
			this.$q.cookies.set('is_auth',true,this.options)
			this.$q.cookies.set('is_login',true,this.options)
			this.$q.cookies.set('role',role,this.options)
			this.$q.cookies.set('email',row.email,this.options)
			this.$q.cookies.set('join_date',row.date_created,this.options)
		}

		// isLogin(){
		// 	if(!this.$q.cookies.has('is_login')){
		// 		window.location = '#/'
		// 	}
		// }
	},
	// mounted () {
	//
	// 	// this.getCategoryList()
	// }
	// watch:{
	// 	'userData.fullname'(newVal){
	// 		console.log('watcher',newVal);
	// 	}
	// }

};