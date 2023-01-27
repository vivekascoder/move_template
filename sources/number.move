
/// Number module
module admin::number {
    struct SomeResource has key {
        number: u64
    }

    fun init_module(account: &signer) {
        move_to(account, SomeResource { number: 0 });
    }

    fun increment(account: &signer) {
        let resource = borrow_global_mut<SomeResource>(account);
        resource.number = resource.number + 1;
    }
}