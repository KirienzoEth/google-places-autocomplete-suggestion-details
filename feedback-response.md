First, thank you for your kind words, and thank you for taking the time to send some feedback. I addressed each points below:

# 1.

My mistake, you are right, I'm not sure why I did it like this even though I used a `map` for the `Promise.all` just above. I implemented the changes.

# 2.

Indeed, it's much clearer that way. I implemented the changes and added some tests to cover that functionality.

# 3.

I think it's because I used `axios({ method: 'get', url, ...options})` first, and when I changed it to `axios.get()`, I forgot to remove the spread.

I guess there's an argument that can be made around shallow/deep copy, as we don't want this parameter to be altered in any way, but it's not really needed here, so I removed the spread operator.

# 4.

I usually do this for classes that most likely won't need to be instanciated multiple times, to have their configuration in one place. Especially as I like to work around domains, here I return the main object that is needed out of the `Google API` domain, same with the `HTTP Client`.

I considered making the main [index.ts](/src/index.ts) a class instead that the user would need to instantiate with the API key (that could address point 6 in a way), like this we would have given the user the choice around the API key handling rather than forcing our configuration and naming, but I didn't want to go too far from the original idea of providing a simple function for users of the lib.

For example, the Google API library allows you to [pass your own axios instance, and if unprovided, fall back on default singletons](https://github.com/googlemaps/google-maps-services-js/blob/master/src/client.ts#L149). I could have used a similar approach, it would have allowed for better flexibility, but for such a small library, seemed overkill.

Dependency Injection is great if you want to abstract external elements, like how the `GoogleAPI` class asks for an interface (`IHTTPClient`) rather than an `Axios` instance, or simply doing `import axios from 'axios';` and using it as is. In that particular case, we avoid tight coupling that would have caused issues at multiple locations in the code base if we decided to switch for node-fetch for example.

# 5.

When there is only one export in the file, I've taken the habit to use a default export, especially when I don't think the file will grow larger and will have more exports in the future in this case.

# 6.

Yes, I've thought about it, but as the API throws an error specifically designed for this ([RequestDeniedError](/src/google-api/GoogleAPIErrors.ts)`)) and the library only having one "endpoint", it would have thrown an error as soon as the user tried to use it, so I thought it would be enough. I understand why you prefer it that way though, so I implemented it and added some test cases.

# 7-8.

One one hand, as the original code mentionned not being sure about using Axios, I did not want to rely too much on Axios specific features, as we would probably need to rewrite the parts that use them if we needed to change for another http client. On the other hand, what's the point of having an `options` parameter if not to use it?

But yes I agree, the `let` reassign for the error handling is not great and using the `params` option would have addressed point 2 as well.

The main problem with using `validateStatus` is that the Google API always returns a 200 unless it's an unexpected exception. The `status` property they return is contained in the response's body and is a string, it's not an HTTP error code in the header, so I can't seem to use it to map the request to a `RequestDeniedError` using that option. I went and checked the Google API library to see how they handle this, and [they use an axios adapter](https://github.com/googlemaps/google-maps-services-js/blob/master/src/adapter.ts#L23) to map the status text to an HTTP status code, so this could be an alternative.
