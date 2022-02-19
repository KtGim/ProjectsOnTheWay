import React from 'react';
import CodeProvider from 'site/CodeProvider';

import B from './B';
import A from './A';

const Amd = `
# heading

${'```'}javascript
    var a = 1;
    console.log(a);
${'```'}

${'```'}demo
<A />
${'```'}

${'```'}tsx
  import React from 'react';

  const A = () => {
      return (
          <div>
              AAAA
          </div>
      )
  };

  export default A;
  ${'```'}

  ${'```'}demo
<B />
${'```'}

${'```'}tsx
    import React from 'react';

    const B = () => {
        return (
            <div>
                BBBB
            </div>
        )
    };

    export default B;
    ${'```'}

`;
const BDemo = () => {
    return (
        <CodeProvider
            markdown={Amd}
            components={{ B, A }}
        />
    )
}

export default BDemo;