<!DOCTYPE html>
<html>
<head>
    <title>Laravel Test</title>
</head>
<body>
    <h1>Laravel is Working!</h1>
    <p>If you can see this, Laravel is successfully running on DreamHost.</p>
    <p>Current time: {{ now() }}</p>
    <p>Laravel version: {{ app()->version() }}</p>
    
    <h2>API Test Links:</h2>
    <ul>
        <li><a href="/api/test">API Test</a></li>
        <li><a href="/api/users">Users API</a></li>
        <li><a href="/api/projects">Projects API</a></li>
    </ul>
</body>
</html>
