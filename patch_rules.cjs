const fs = require('fs');
let code = fs.readFileSync('firestore.rules', 'utf-8');

const newRule = `      match /evidences/{evidenceId} {
        allow read: if isSignedIn() && get(/databases/$(database)/documents/works/$(workId)).data.authorId == request.auth.uid;
        allow create: if isSignedIn() && incoming().authorId == request.auth.uid;
        allow update: if isSignedIn() && incoming().authorId == request.auth.uid;
        allow delete: if false;
      }
    }
  }
}`;

code = code.replace(/    \}\n  \}\n\}/, newRule);
fs.writeFileSync('firestore.rules', code);
