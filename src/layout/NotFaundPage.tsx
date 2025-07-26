import { Button, Space } from 'antd'
import { showNotification } from '../utils/showNotification'

function NotFaundPage() {
  return (
    <>
      <Space>
        <Button
          onClick={() =>
            showNotification({
              message: 'Prueba',
              type: 'error',
            })
          }
          type="primary"
        >
          Primary
        </Button>
        <Button>Default</Button>
        <p>
          Lorem ipsum, dolor sit amet consectetur adipisicing elit. Accusamus
          error pariatur libero ducimus sit, dolores voluptatibus, maiores quis
          delectus placeat voluptate nesciunt sunt similique tenetur iure omnis,
          velit ab doloremque.hydfg
        </p>
      </Space>
      <p>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Possimus at
        voluptas cupiditate modi ipsa alias molestiae aperiam consequatur
        voluptate veniam sed perferendis asperiores non, ad tempore fugit
        accusamus? Tempore, neque!
      </p>
      <p>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Possimus at
        voluptas cupiditate modi ipsa alias molestiae aperiam consequatur
        voluptate veniam sed perferendis asperiores non, ad tempore fugit
        accusamus? Tempore, neque!
      </p>
      <p>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Possimus at
        voluptas cupiditate modi ipsa alias molestiae aperiam consequatur
        voluptate veniam sed perferendis asperiores non, ad tempore fugit
        accusamus? Tempore, neque!
      </p>
    </>
  )
}

export default NotFaundPage
