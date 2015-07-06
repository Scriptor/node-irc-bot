module.exports = {
	nicks: ['angrywombat', 'veonik'],
	is: function( nick ){
		if( nick in this.nicks )
			return true;
		else
			return false;
	}
}