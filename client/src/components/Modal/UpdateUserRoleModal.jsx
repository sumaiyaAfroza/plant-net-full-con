import { Button, Dialog, DialogPanel, DialogTitle } from '@headlessui/react'

export default function UpdateUserRoleModal({isOpen,setIsOpen}) {

	function close() {
		setIsOpen(false)
	}

	const handleSubmit = (e) =>{
		e.preventDefault()
	}

	return (
		<>
			<Dialog open={isOpen} as="div" className="relative z-10 focus:outline-none" onClose={close} __demoMode>
				<div className="fixed inset-0 z-10 w-screen overflow-y-auto">
					<div className="flex min-h-full items-center justify-center p-4">
						<DialogPanel
							transition
							className="w-full border max-w-md rounded-xl bg-white/5 p-6 backdrop-blur-2xl duration-300 ease-out data-closed:transform-[scale(95%)] data-closed:opacity-0"
						>
							<DialogTitle as="h3" className="text-base/7 font-medium text-black">
							   Update User Role
							</DialogTitle>
							<form onSubmit={handleSubmit}>
								<div>
									<label className='font-semibold my-5'>select user</label>
									<select className='border w-full mb-4'>
										<option value='customer'>Customer</option>
										<option value='admin'>Admin</option>
										<option value='seller'>Seller</option>

									</select>
								</div>
							</form>
							<div className='flex justify-between ' >
								<Button
									className="inline-flex items-center rounded-md bg-gray-700 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-inner shadow-white/10 focus:not-data-focus:outline-none data-focus:outline data-focus:outline-white data-hover:bg-gray-600 data-open:bg-gray-700"
									onClick={close}
								>
									close
								</Button>
								<Button
									className="inline-flex items-center rounded-md bg-gray-700 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-inner shadow-white/10 focus:not-data-focus:outline-none data-focus:outline data-focus:outline-white data-hover:bg-gray-600 data-open:bg-gray-700"
								>
									update
								</Button>
							</div>
						</DialogPanel>
					</div>
				</div>
			</Dialog>
		</>
	)
}
