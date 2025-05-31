const command = `
sc stop aaaService

sc delete aaaService

sc create aaaService binPath= "\\"xxx\\" --billddir \\"xxx\\"" start= auto

sc start aaaService
`;
console.log(command);
