'use strict'
const fs = require('fs')
const path = require('path')

module.exports = function generate(outputFile) {
  const doc = outputFile || './doc/third-party.md'
  const docDir = path.dirname(doc)

  if (!fs.existsSync(docDir)) fs.mkdirSync(docDir)

  const bower = fs.existsSync('./bower.json') ? loadJSON('./bower.json') : null
  const npm = loadJSON('./package.json')
  const name = npm.name = (bower && bower.name) || npm.name
  fs.writeFileSync(doc, `# ${name}\n\n`)
  fs.appendFileSync(doc, '## Direct Dependencies\n\n')
  if (bower && bower.dependencies) {
    fs.appendFileSync(doc, '### Bower\n\n')
    fs.appendFileSync(doc, Object.keys(bower.dependencies).map(dep => `[${dep}](#${dep.toLowerCase()})`).join(', '))
    fs.appendFileSync(doc, '\n\n')
  }
  fs.appendFileSync(doc, '### Node\n\n')
  fs.appendFileSync(doc, Object.keys(npm.dependencies).map(dep => `[${dep}](#${dep.toLowerCase()})`).join(', '))
  fs.appendFileSync(doc, '\n\n')

  if (bower) {
    fs.appendFileSync(doc, '## Bower components\n\n', {encoding: 'utf8'})
    doc_modules('bower_components', bower)
  }
  fs.appendFileSync(doc, '## NodeJS modules\n\n', {encoding: 'utf8'})
  doc_modules('node_modules', npm)

  function doc_modules(modules_folder, rootPkg) {
    const dirs = fs.readdirSync(modules_folder).filter(dir => dir !== '.bin')
    const dependers = {}
    dirs.forEach(dir => dependers[dir] = [])

    Object.keys(rootPkg.dependencies).forEach(dep => dependers[dep].push(rootPkg.name))

    const pkgs = dirs.map(dir => {
      const pkgFile = `./${modules_folder}/${dir}/package.json`
      const bowerFile = `./${modules_folder}/${dir}/bower.json`
      const pkg = fs.existsSync(pkgFile) ? loadJSON(pkgFile) : {}
      Object.assign(pkg, fs.existsSync(bowerFile) ? loadJSON(bowerFile) : {})
      return pkg
    })
    pkgs.forEach(pkg =>
      Object.keys(pkg.dependencies || {}).forEach(dependency => {
        if (dependers[dependency]) dependers[dependency].push(pkg.name)
      }))

    const outputs = pkgs.map(pkg => {
      let output = `### ${pkg.name}\n\n`
      output += `version ${pkg.version || 'unknown'}`
      if (pkg.license) {
        if (pkg.license.length) output += ` (${pkg.license} license)`
        if (pkg.license.type) output += ` ([${pkg.license.type} license](${pkg.license.url}))`
      }
      output += '\n\n'
      if (pkg.description) output += `${pkg.description}\n\n`
      if (pkg.homepage) output += `[Homepage](${pkg.homepage})\n\n`
      const deps = Object.keys(pkg.dependencies || {})
      if (deps.length) {
        output += '#### Dependencies\n\n'
        output += deps.map((dep) => `[${dep}](#${dep.toLowerCase()})`).join(', ')
        output += '\n\n'
      }
      if (dependers[pkg.name] && dependers[pkg.name].length) {
        output += '#### Dependers\n\n'
        output += dependers[pkg.name].map(depender => `[${depender}](#${depender.toLowerCase()})`).join(', ')
        output += '\n\n'
      }
      return output
    })

    outputs.forEach(output => fs.appendFileSync(doc, output, {encoding: 'utf8'}))
  }
}

function loadJSON(file) {
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'))
  } catch (error) {
    console.log(`invalid json: ${file}`)
  }
}
