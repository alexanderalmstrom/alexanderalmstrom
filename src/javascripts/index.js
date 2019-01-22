// index.js

document.addEventListener('PROJECT_LOADED', () => {
  console.log('PROJECT LOADED')

  // const projectName = document.querySelector('.project-name')

  // if (!projectName) return

  // const text = new Blotter.Text(projectName.innerHTML, {
  //   family : "Circular Std",
  //   size : 90,
  //   fill : "#000000"
  // })

  // const material = new Blotter.ChannelSplitMaterial()

  // const blotter = new Blotter(material, {
  //   texts : text
  // })

  // const scope = blotter.forText(text)

  // projectName.innerHTML = ""

  // scope.appendTo(projectName)
})

document.addEventListener('APP_LOADED', () => {
  console.log('APP LOADED')
})