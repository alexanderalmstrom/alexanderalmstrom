const fs = require('fs')

function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function RevPlugin(options) {
  this.options = options
}

RevPlugin.prototype.apply = function (compiler) {
  const options = this.options

  if (!options.manifest) throw new Error('No manifest specified in RevPlugin')

  if (!options.files.length) throw new Error('No files specified in RevPlugin')

  compiler.hooks.done.tap('RevPlugin', function (stats) {
    if (stats.hasErrors()) return

    const replacer = function (filePath, from, to) {
      const str = fs.readFileSync(filePath, 'utf8')
      const out = str.replace(new RegExp(escapeRegExp(from), 'g'), function () {
        return to
      })

      fs.writeFileSync(filePath, out)
    }

    const manifestFile = JSON.parse(fs.readFileSync(options.manifest, 'utf8'))

    if (!manifestFile) throw new Error('manifest.json could not be found')

    for (const filePath of options.files) {
      for (const assetKey in manifestFile) {
        replacer(filePath, assetKey, manifestFile[assetKey])
      }
    }
  })
}

module.exports = RevPlugin
