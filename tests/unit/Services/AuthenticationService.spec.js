import sinon from 'sinon';
import { assert } from 'chai';
import auth from '@/Services/authentication.service';

describe('Authentication Service', () => {
	afterEach('Reset sinon and settings', () => {
		sinon.restore();
		auth.user = null;
		delete global.localStorage;
	});

	it('Stores user data in local storage', () => {
		global.localStorage = {
			setItem() {
			}
		};
		const setItemStub = sinon.stub(global.localStorage, 'setItem');
		const time = Date.now();
		const user = {
			id: 1,
			username: 'test',
			exp: time
		}
		auth.saveUser(user);
		sinon.assert.calledWith(setItemStub, 'captains-map.user_id', 1);
		sinon.assert.calledWith(setItemStub, 'captains-map.username', 'test');
		sinon.assert.calledWith(setItemStub, 'captains-map.exp', time);
		assert.deepEqual(auth.user, user);
	});

	it('Returns user details from local storage', () => {
		global.localStorage = {
			getItem() {
			}
		};
		const time = Date.now();
		const user = {
			id: 1,
			username: 'test',
			exp: time
		};
		sinon.stub(global.localStorage, 'getItem').callsFake((key) => {
			switch (key) {
				case 'captains-map.user_id':
					return 1;
				case 'captains-map.username':
					return 'test';
				case 'captains-map.exp':
					return time;
			}
		});
		assert.deepEqual(auth.getUserDetails(), user);
		assert.deepEqual(auth.user, user);
	});

	it('Returns user details from already loaded user', () => {
		global.localStorage = {
			getItem() {
			}
		};
		const time = Date.now();
		const user = {
			id: 1,
			username: 'test',
			exp: time
		};
		auth.user = user;
		const getItemStub = sinon.stub(global.localStorage, 'getItem');
		assert.deepEqual(auth.getUserDetails(), user);
		sinon.assert.notCalled(getItemStub);
	});

	it('Returns null when there is no user', () => {
		global.localStorage = {
			getItem() {
			}
		};
		sinon.stub(global.localStorage, 'getItem').callsFake(() => {
			throw new Error("Key doesn't exist");
		});
		assert.isNull(auth.getUserDetails());
	});

	it('isLoggedIn returns true for non expired existing user', () => {
		const time = Date.now() + 10000;
		auth.user = {
			id: 1,
			username: 'test',
			exp: time
		};
		assert.isTrue(auth.isLoggedIn());
	});

	it('isLoggedIn returns false for expired existing user and calls log out', () => {
		const logoutStub = sinon.stub(auth, 'logout');
		const time = Date.now() - 10000;
		auth.user = {
			id: 1,
			username: 'test',
			exp: time
		};
		assert.isNotTrue(auth.isLoggedIn());
		sinon.assert.calledOnce(logoutStub);
	});


	it('isLoggedIn returns false for no user', () => {
		assert.isNotTrue(auth.isLoggedIn());
	});

	it('Logs out user and deletes from local sotrage', () => {
		global.localStorage = {
			removeItem() {
			}
		};
		const removeItemStub = sinon.stub(global.localStorage, 'removeItem');
		auth.user = {
			id: 1,
			username: 'test',
			exp: Date.now()
		};
		auth.logout();
		sinon.assert.calledWith(removeItemStub, 'captains-map.user_id');
		sinon.assert.calledWith(removeItemStub, 'captains-map.username');
		sinon.assert.calledWith(removeItemStub, 'captains-map.exp');
		assert.isNull(auth.user);
	});

});
