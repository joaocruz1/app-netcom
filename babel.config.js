module.exports = function (api) {
  api.cache(true);
  let plugins = []; // Plugins está vazio aqui

  return {
    presets: [['babel-preset-expo', { jsxImportSource: 'nativewind' }], 'nativewind/babel'], // 'nativewind/babel' está no lugar errado e jsxImportSource não é mais necessário assim com NativeWind v4
    plugins, // Isso resulta em um array de plugins vazio
  };
};
