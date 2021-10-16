import { ReactNode } from 'react'
import { Box } from '@chakra-ui/react'

interface IWrapperProps {
  children: ReactNode
}

const Wrapper = ({ children }: IWrapperProps) => {
  return (
    <Box maxW="400px" w="100%" mt={8} mx="auto">
      {children}
    </Box>
  )
}

export default Wrapper
