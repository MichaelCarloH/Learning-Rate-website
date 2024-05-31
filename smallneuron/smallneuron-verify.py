# torch verification path
import torch

# inputs
a = torch.tensor(2.7, dtype=torch.float64)
b = torch.tensor(0, dtype=torch.float64)
c = torch.tensor(-4, dtype=torch.float64)
d = torch.tensor(5, dtype=torch.float64)
e = torch.tensor(0.23, dtype=torch.float64)
f = torch.tensor(3, dtype=torch.float64)

a.requires_grad = True
b.requires_grad = True
c.requires_grad = True
d.requires_grad = True
e.requires_grad = True
f.requires_grad = True

# out = ((a + (((b-c)*d)/(e*d))) * (((-1/f).exp()).tanh()**3) * (a.relu().exp()/e)) / 1e2
out = ((-((-1/a**2).tanh()+((1/((-c).exp())))*d)).relu()**-3 - (-(f*(e+b))/(c*d)).exp()*1e4)/1e2
out.backward()



# Tests

print("---- Output ----")
print(out.data)


print("---- Gradients ----")
print('gradient for a:', a.grad)
print('gradient for b:', b.grad)
print('gradient for c:', c.grad)
print('gradient for d:', d.grad)
print('gradient for e:', e.grad)
print('gradient for f:', f.grad)