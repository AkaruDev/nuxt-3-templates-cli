# Nuxt 3 templates CLI

> Install features from [Nuxt templates repo](https://github.com/AkaruDev/nuxt-3-templates)

## Installation

```bash
npm install -g nuxt-3-templates-cli
```

## Usage

### Install features

```bash
nuxt-3-templates install
```

Displays a checkbox list of all features (all branches in the repository that start with `features/`).  
After selection, it downloads all required files and install dependencies with yarn or npm.

#### Arguments

- **Token (`install --token xxx`)**

Each `install` command use multiple calls to the Github API, which is limited to 60 requests per hour.

Create an API token in [Github developer settings](https://github.com/settings/tokens) to get more requests per hour.

- **Repository (`install --repository xxx`)**

By default, `install` command is looking for features in `AkaruDev/nuxt-3-templates` Github repository. Pass an other repository name if you forked it to add your own features (More info on how to do it [here](https://github.com/AkaruDev/nuxt-3-templates)). 

- **Tmp directory (`install --tmp my-directory`)**

`install` command requires to temporary store files to work. Pass an other directory name (relative to root directory) if `tmp` directory is already used for something else.

### Get config

Utils for copying in your `nuxt.config.ts` the extendeds files needed for the module(s).

```bash
nuxt-templates get-config
```

Exemple:
```bash
export default defineNuxtConfig({
    extends:[
        './configs/page-transitions',
        './configs/virtual-scroll'
    ]
})
```

## Testing
You have a minimalist Nuxt 3 environment in `/playground` to test/debug the commands.
