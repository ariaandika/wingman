# Wingman

fullstack web server

## Frontend

bring back the hypermedia by adding various powerfull html attributes that allow element
to do fetch request.

## View

use jsx in server to serve html response.

## Router

use express like pattern for router.

## Example

combine them all

server:

```ts
export const Login = new Wingman()

.get('/', () => (
    <form method="post" pr-target="#msg">
        <input type="text" name="username"/>
        <input type="password" name="passwd"/>
        <div id="msg"></div>
    </form>
))
.post('/', async ({ res }) => {
    const result = await login(res.body);

    if (result.ok) {
        return res.redirect('/home');
    } else {
        res.status = 401
        return <div class="error">Username atau Password salah</div>
    }
})
```

