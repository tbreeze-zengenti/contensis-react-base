const setCachingHeaders = (response, {
  cacheControl = 'private',
  surrogateControl = '3600'
}, method = 'header') => {
  if (cacheControl) response[method]('Cache-Control', cacheControl);
  if (surrogateControl) response[method]('Surrogate-Control', `max-age=${surrogateControl.toString()}`);
};

const url = (alias, project) => {
  const projectAndAlias = project && project.toLowerCase() !== 'website' ? `${project.toLowerCase()}-${alias}` : alias;
  return {
    api: `https://api-${alias}.cloud.contensis.com`,
    cms: `https://cms-${alias}.cloud.contensis.com`,
    liveWeb: `https://live-${projectAndAlias}.cloud.contensis.com`,
    previewWeb: `https://preview-${projectAndAlias}.cloud.contensis.com`,
    iisWeb: `https://iis-live-${projectAndAlias}.cloud.contensis.com`,
    iisPreviewWeb: `https://iis-preview-${projectAndAlias}.cloud.contensis.com`
  };
};

export { setCachingHeaders as s, url as u };
//# sourceMappingURL=urls-DfCisos-.js.map
