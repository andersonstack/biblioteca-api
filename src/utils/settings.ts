import axios from 'axios';
import path from 'path';
import fs from 'fs';

export async function baixarImagem(imagemLink: string): Promise<string> {
    try {
      const response = await axios.get(imagemLink, {responseType: 'stream'});
      
      const validExtensions = ['.jpg', '.jpeg', '.png', '.webp'];
      const ext = path.extname(imagemLink.split('?')[0]).toLocaleLowerCase();
      if (!validExtensions.includes(ext))
          return "";

      const nomeArquivo = Date.now() + path.extname(imagemLink.split('?')[0]);

      const caminhoCompleto = path.join(__dirname, 'uploads', nomeArquivo);
      const writer = fs.createWriteStream(caminhoCompleto);
  
      response.data.pipe(writer);
  
      await new Promise((resolve, reject) => {
        writer.on('finish', () => resolve(undefined));
        writer.on('error', reject);
      });

      return `/uploads/${nomeArquivo}`;

    } catch (error) {
      console.log(error);
      return "";
    }
}
 