import fs from '/substrate-front-end-template/static/html/components/varan-header/external/fs.mjs'

export default async (v,p,c,obj,r) => {
    await fs(v,p,c,obj,r)
    if(obj.preset.status) {
      let template = await (await import(`/substrate-front-end-template/static/html/components/varan-header/template/${obj.preset.name}/${obj.preset.name}.mjs`))['default'](v,p,c,obj,r)
      // console.log(`(external-index.mjs*)${template}`,template)
    }
}