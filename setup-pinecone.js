const { Pinecone } = require('@pinecone-database/pinecone');
require('dotenv').config({ path: '.env.local' });

async function setupPinecone() {
  try {
    const pinecone = new Pinecone({
      apiKey: process.env.PINECONE_API_KEY,
    });

    console.log('Creating Pinecone index...');
    
    await pinecone.createIndex({
      name: 'ai-knowledge-search',
      dimension: 1536,
      metric: 'cosine',
      spec: {
        serverless: {
          cloud: 'aws',
          region: 'us-east-1'
        }
      }
    });

    console.log('✅ Pinecone index "ai-knowledge-search" created successfully!');
    console.log('You can now upload documents to your knowledge base.');
    
  } catch (error) {
    if (error.message.includes('already exists')) {
      console.log('✅ Pinecone index "ai-knowledge-search" already exists!');
    } else {
      console.error('❌ Error creating Pinecone index:', error.message);
      console.log('\nPlease check:');
      console.log('1. Your PINECONE_API_KEY in .env.local');
      console.log('2. Your Pinecone account has sufficient credits');
      console.log('3. You have permission to create indexes');
    }
  }
}

setupPinecone();
