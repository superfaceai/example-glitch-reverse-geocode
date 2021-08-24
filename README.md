# Reverse Geocode Example

This project showcases the use of <https://superface.ai> to seamlessly integrate APIs without worrying about how they are implemented or even knowing what API and therefore provider do you use.

## Application

The demo application allows you to fetch address based on entered coordinates.

To see how to fetch the coordinates using Superface's [OneSDK](https://github.com/superfaceai/one-sdk-js) check out the `getAddress()` function in the `superface.js` file.

## What's in this project?

← `superface.js`: This file contains all superface code except superface client code, which is centralized in `client.js`. It contains function `getAddress()` where profile and provider are set and result from perform is handled

← `public/`, `src/`: Folders from the remixed Glitch Node.js starter project, it is safe to ignore those for the puprose of learning about Superface

← `server.js`: The main server script of the application, it does not contain Superface-specific code, only a boiler plate to make the application work

← `superface/`: Superface folder that contains the configuration of the [OneSDK](https://github.com/superfaceai/one-sdk-js) for the capabilities and providers used in the application

← `superface/super.json`: The actual configuration of the capabilties and providers

← `.env`: Secrets such as API keys for the used providers

## More Examples

[Geocode Example](https://glitch.com/edit/#!/superface-geocode) - use Superface to get coordinates from address

[Email Example](https://glitch.com/edit/#!/wiggly-lumbar-paprika) - send a resilient email with Superface

## Get in touch

We would ❤️ to hear your feedback! Please get in touch either with Vrata (<a href="mailto:v@superface.ai">v@superface.ai</a>) or Z (<a href="mailto:z@superface.ai">z@superface.ai</a>).

If you haven't already, sign up at [https://superface.ai](https://superface.ai).

You can also follow us at Twitter [@superfaceai](https://twitter.com/superfaceai).
