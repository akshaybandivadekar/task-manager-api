const request = require('supertest');
const app = require('../src/app');
const bcrypt = require('bcryptjs')
const User = require('../src/models/user');
const {userOneId, userOne, setupDatabase} = require('./fixtures/db');

beforeEach(setupDatabase);

test('Should singup a new user', async() => {
    const response = await request(app).post('/users').send({
        name: 'Spiffcity Admin',
        email: 'spiffcity50@gmail.com',
        password: 'Test12345'
    }).expect(201);

    //Asset that the database that was changed correctly
    const user = await User.findById(response.body.user._id);
    expect(user).not.toBeNull();

    //Assertion about the response
    expect(response.body).toMatchObject({
        user: {
            name: 'Spiffcity Admin',
            email: 'spiffcity50@gmail.com',
        },
        token: user.tokens[0].token
    });

    expect(user.password).not.toBe('Test12345');
});

test('Should login existing user', async() => {
    const response = await request(app).post('/users/login').send({
        email: userOne.email,
        password: userOne.password
    }).expect(200);

    const user = await User.findById(response.body.user._id);
    expect(user).not.toBeNull();

    expect(response.body.token).toBe(user.tokens[1].token);
});

test('Should not login nonexisting user', async() => {
    await request(app).post('/users/login').send({
        email: userOne.email,
        password: 'Test123'
    }).expect(400);
});

test('Should get profile for use', async() => {
    await request(app)
        .get('/users/me')
        .set('Authorization',`Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200);
});

test('Should not get profile for unauthenticated user', async() => {
    await request(app)
        .get('/users/me')
        .send()
        .expect(401);
});

test('Should delete account for user', async() => {
    const response = await request(app)
        .delete('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200);
    
    const user = await User.findById(userOneId);
    expect(user).toBeNull();
    
});

test('Should not delete account for unautheticated user', async() => {
    await request(app)
        .delete('/users/me')
        .send()
        .expect(401);
});

test('Should upload the avatar image', async() => {
    await request(app)
        .post('/users/me/avatar')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .attach('avatar','tests/fixtures/profile-pic.jpg')
        .expect(200);
    const user = await User.findById(userOneId);
    expect(user.avatar).toEqual(expect.any(Buffer));
});

test('Should update valid user field', async() => {
    await request(app)
        .patch('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            name: 'test'
        })
        .expect(200);

    const user = await User.findById(userOneId);
    expect(user.name).toBe('test');
});

test('Should not update invalid user field', async() => {
    await request(app)
        .patch('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            location: 'usa'
        })
        .expect(400);
});

test('Should not signup user with invalid email', async () => {
    // Assertion to check bad email address
    await request(app)
        .post('/users')
        .send({
            name: 'Devika',
            email: 'dev.com',
            password: 'DDAANN12'
        })
        .expect(400)
})

test('Should not signup user with invalid password', async () => {
    // Assertion to check bad password
    await request(app)
        .post('/users')
        .send({
            name: 'Devika',
            emial: 'dev@gmail.com',
            password: 'DEV12'
        })
        .expect(400)
})

test('Should not update the user if unauthenticated', async () => {
    // Assertion to check the security 
    await request(app)
        .patch('/users/me')
        .send({
            name: 'Dev'
        })
        .expect(401)
})

test('Should not update user with invalid email', async () => {
    const response = await request(app)
        .patch('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            email: 'dev123.com'
        })
        .expect(400)

    const user = await User.findById(userOneId)
    expect(user.email).not.toBe('dev123.com')
})

test('Should not update user with invalid password', async () => {
    const response = await request(app)
        .patch('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            password: '1234'
        })
        .expect(400)

    const user = await User.findById(userOneId)
    const isSame = await bcrypt.compare('1234', user.password)
    expect(isSame).toBe(false)
})